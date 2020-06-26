using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Acme_Bank.Services.Transaction;
using Acme_Bank.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Acme_Bank.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class WithdrawalApiController : Controller
    {
        private readonly ITransactService _requestService;
        public WithdrawalApiController(ITransactService requestService)
        {
            _requestService = requestService;
        }

        [HttpPost]
        [Route("Withdrawal")]
        public async Task <JsonResult> Withdrawal(Request request)
        {
            float overdraft = 500;
            try
            {
                if (request.accountnumber != null && request.ammount != null)
                {
                    var list = await _requestService.Transactions();
                    var result = list.Where(a => a.account_number.ToString() == request.accountnumber.ToString());

                    if (result.FirstOrDefault().account_type.ToLower() == "savings")
                    {
                        if (float.Parse(result.FirstOrDefault().balance) < float.Parse(request.ammount))
                        {
                            return Json(new { Success = false, Result = "Cannot withdraw more than the balance" });
                        }
                    }
                    else if (result.FirstOrDefault().account_type.ToLower() == "cheque")
                    {
                        if (overdraft + float.Parse(result.FirstOrDefault().balance) < float.Parse(request.ammount))
                        {
                            return Json(new { Success = false, Result = "Overdraft exceeded R500 limit" });
                        }
                    }

                }
                return Json(new { Success = true, Result = "Success" });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    Success = false,
                    Error = ex.Message
                });
            }
        }
    }
}
