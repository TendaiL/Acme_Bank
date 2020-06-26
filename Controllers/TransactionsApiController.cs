using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Acme_Bank.Services;
using Acme_Bank.Services.Transaction;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Acme_Bank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsApiController : Controller
    {
        private readonly ITransactService _requestService;
        public TransactionsApiController(ITransactService requestService)
        {
            _requestService = requestService;
        }
        [HttpPost]
        [Route("GetTransactionList")]
        public async Task<JsonResult> GetTransactionList()
        {
            try
            {
                var list = await _requestService.Transactions();
                return Json(new { Success = true, Result = list });
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
