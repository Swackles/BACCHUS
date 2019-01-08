using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using Newtonsoft.Json;
using veebirakendus.Models;

namespace veebirakendus.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            string json = new WebClient().DownloadString("http://uptime-auction-api.azurewebsites.net/api/Auction").Replace("product", "").Replace("bidding", "");

            List<product> products = JsonConvert.DeserializeObject<List<product>>(json);

            return View(products);
        }
    }
}