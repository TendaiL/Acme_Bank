using Acme_Bank.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acme_Bank.Services.Transaction
{
   public  interface ITransactService
    {
        Task<List<Transactions>> Transactions();
    }
}
