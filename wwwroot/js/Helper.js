var currentListIndex = 0;
var ListData = undefined;
var accountnumber = 0;
if (typeof RECORDS_PER_PAGE === 'undefined') {
    var RECORDS_PER_PAGE = 10;
}
Handlebars.registerHelper('sum', function (arr) {
    let s = 0;
    for (let i = 0; i < arr.length; i++) {
        s = s + parseFloat(arr[i].balance);
    }
    return s;
})

Handlebars.registerHelper("checkIfPagesIsClickable", function (page, currentPage) {
    if (page != currentPage) {
        return "clickable";
    }
    return "nonClickablePager";
});

Handlebars.registerHelper("diactivate", function (account_type, balance) {
    if (account_type == "savings") {

        if (balance == -20.00) {
            return "disabled";
        }
    }
    return "nonClickablePager";
});


$.when(GetTemplates())
    .then
    (
        function (templates) {
            PopulateList(templates);
        }
);

function refreshpage() {
    $.when(GetTemplates())
        .then
        (
            function (templates) {
                PopulateList(templates);
            }
        );
}

function GetTemplates() {
    return new Promise(function (resolve, reject) {
        $.ajax(
            {
                url: "/Templates/Transactions/Transaction.html",
                type: "GET",
                success: function (data) {
                    resolve(data);
                },
                error: function (error) {
                    reject(error);
                }
            });
    });
}


function PopulateList(templates) {
    $.ajax(
        {
            url: '/API/TransactionsApi/GetTransactionList',
            type: 'POST',
            async: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.success) {
                    ListData = result.result;
                    ListTemplateText = $(templates).filter("#tmptranslist").html();
                    displayListPage();
                }
                else {

                }
            },
            error: function (error) {

            }
        });
}
function applyTemplateToControl(temp, contentId, data) {
    var template = Handlebars.compile(temp);
    var html = template({ data: data });
    $(contentId).html(html);
}


function displayListPage() {
    const currentPageData = getCurrentPageData();
    console.log(currentPageData);
    applyTemplateToControl(ListTemplateText, "#attachment", currentPageData);
};

function getCurrentPageData() {
    return {
        array: ListData.slice(currentListIndex, currentListIndex + RECORDS_PER_PAGE),
        paging: buildPagingData(ListData, currentListIndex, RECORDS_PER_PAGE),
        clickFunction: "goToPageIndex"
    }
}

function goToPageIndex(index) {
    currentListIndex = index;
    displayListPage();
}


function Withdraw(accountvaluenumber) {
    $("#Withdraw").modal("show");
    $("#withdrawal").val("");
    accountnumber = accountvaluenumber;
}

function withdrawal(event) {
    var request = {        
        "accountnumber": accountnumber,
        "ammount": $("#withdrawal").val()       
    };
    axios.post("/API/WithdrawalApi/Withdrawal", request)
        .then(function (response) {
            if (response.data.success == true) {
                $("#Withdraw").modal("hide");
                $('#Withdraw').on('hidden.bs.modal', function (e) {
                    alert(response.data.result);
                    $(e.currentTarget).unbind();
                })
            }
            else
            {
                $("#Withdraw").modal("hide");
                $('#Withdraw').on('hidden.bs.modal', function (e) {
                    alert(response.data.result);
                    $(e.currentTarget).unbind();
                })
            }
     
        })
        .catch(function (error) {
            alert(error);
        });
}

function buildPagingData(dataObjects, currentIndex, itemsPerPage) {
    var currentPageNumber = (currentIndex / itemsPerPage) + 1;
    var itemCount = dataObjects == null ? 0 : dataObjects.length;
    var lastPageNumber = Math.floor(itemCount / itemsPerPage) + 1;

    var paging = {};

    paging.activePageNumber = currentPageNumber;
    paging.recordCount = itemCount;
    paging.pages = new Array();
    if (dataObjects != null && itemCount > itemsPerPage) {
        var startPageNumber = currentPageNumber - 3;
        if (startPageNumber <= 0) {
            startPageNumber = 1;
        } else if (startPageNumber > 1 && itemCount > (itemsPerPage * 7)) {
            var page = {};
            page.firstRecordIndex = 0;
            page.pageNumber = "<<";
            paging.pages.push(page);
            page.clickFunction = "goToPageIndex";
            page = {};
            page.firstRecordIndex = (currentPageNumber - 2) * itemsPerPage;
            page.pageNumber = "<";
            page.clickFunction = "goToPageIndex";
            paging.pages.push(page);
        }

        var startIndex = (startPageNumber - 1) * itemsPerPage;
        if (itemCount < (itemsPerPage * 7)) {
            startIndex = 0;
        }

        for (var pageNumber = 0; pageNumber < 7; pageNumber++) {
            if (startIndex < itemCount) {
                var page = {};
                page.clickFunction = "goToPageIndex";
                page.firstRecordIndex = startIndex;
                page.pageNumber = ((startIndex / itemsPerPage) + 1).toString();
                paging.pages.push(page);
            }
            startIndex += itemsPerPage;
        }

        // if there are more records, add the last paging controls
        if (startIndex < itemCount) {
            var page = {};
            page.firstRecordIndex = currentPageNumber * itemsPerPage;
            page.pageNumber = ">";
            page.clickFunction = "goToPageIndex";
            paging.pages.push(page);
            page = {};
            page.firstRecordIndex = Math.floor(itemCount / itemsPerPage) * itemsPerPage;
            page.pageNumber = ">>";
            page.clickFunction = "goToPageIndex";
            paging.pages.push(page);
        }
    }
    return paging;
}
RegisterMoneyInput("#withdrawal");
function RegisterMoneyInput(selector, includeCents) {
    if (includeCents === undefined) {
        includeCents = true;
    }

    $(selector).keydown(function (event) {
        if ($(selector).is('[readonly]')) {
            event.preventDefault();
        }

        // block anything but numbers and decimals
        if (!(
            event.shiftKey == true ||
            (event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 35 || event.keyCode == 36 || event.keyCode == 37 ||
            event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 110)) {
            event.preventDefault();
            return;
        }

        // don't allow multiple decimals or for the entry to start with a decimal
        var pointIndex = $(this).val().indexOf(".");
        var currentVal = $(this).val();

        if (currentVal.length > 20) {
            event.preventDefault();
            return;
        }

        if ((event.keyCode == 190 || event.keyCode == 110) && (currentVal == "" || pointIndex !== -1)) {
            event.preventDefault();
        }
    });

    $(selector).keyup(function (event) {
        if ($(selector).is('[readonly]')) {
            event.preventDefault();
        }

        // only allow 2 decimal places
        var pointIndex = $(this).val().indexOf(".");
        if (pointIndex == -1) {
            return;
        }
    });

    if (includeCents) {
        //$(selector).maskMoney({ prefix: 'R ', allowNegative: false, thousands: ',', decimal: '.', affixesStay: true });
    }
    else {
        $(selector).maskMoney({ prefix: 'R ', allowNegative: false, thousands: ',', precision: 0, affixesStay: true });
    }
}

