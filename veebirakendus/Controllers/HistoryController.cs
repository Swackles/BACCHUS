using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using veebirakendus.Models;
using System.IO;
using Newtonsoft.Json;
using System.Diagnostics;

namespace veebirakendus.Controllers
{
    public class history
    {
        public product Product { get; set; }
        public List<bid> Bids { get; set; }

    }
    public class HistoryController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Get(user user)
        {
            string path = Path.GetDirectoryName(this.GetType().Assembly.Location) + "/../bids.json";
            if (!System.IO.File.Exists(path)) return Json("ERROR: No History");

            List<bid> Bids = JsonConvert.DeserializeObject<List<bid>>(System.IO.File.ReadAllText(path, System.Text.Encoding.UTF8)).Where(x => x.User.Forname == user.Forname && x.User.Surname == user.Surname).ToList();

            if (Bids.Count() == 0) return Json("ERROR: No History");

            List<history> History = new List<history>();

            foreach (bid item in Bids)
            {
                history historyItem = History.Find(x => x.Product.Id == item.Product.Id);

                Debug.WriteLine(item);

                if (historyItem == null) {
                    historyItem = new history() { Bids = new List<bid>() };
                    History.Add(historyItem);
                }

                historyItem.Product = item.Product;
                historyItem.Bids.Add(item);                
            }

            return PartialView(History);
        }
    }
}