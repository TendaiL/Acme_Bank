using Acme_Bank.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Acme_Bank.Infrastructure
{
    public interface IHttpClient
    {
        Task<string> GetTransactionsAsync(string uri);
    }
}
