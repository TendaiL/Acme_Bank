using Acme_Bank.Infrastructure;
using Acme_Bank.Models;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acme_Bank.Services.Transaction.Implementation
{
    public class TransactService : ITransactService
    {
        private readonly IOptionsSnapshot<AppSettings> _settings;
        private readonly string _remoteServiceBaseUrl;
        private IHttpClient _apiClient;
        public TransactService(IOptionsSnapshot<AppSettings> settings, IHttpClient apiClient)
        {
            _remoteServiceBaseUrl = $"{settings.Value.TransactionUrl}";
            _settings = settings;
            _apiClient = apiClient;
        }
        public async Task<List<Transactions>> Transactions()
        {
            var allTransactionsUri = APIPaths.TransactionsPaths.Transactions(_remoteServiceBaseUrl);
            var dataString = await _apiClient.GetTransactionsAsync(allTransactionsUri);
            var response = JsonConvert.DeserializeObject<List<Transactions>>(dataString);
            return response;
        }
    }
}
