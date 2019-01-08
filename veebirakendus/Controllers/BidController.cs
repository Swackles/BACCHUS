using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using veebirakendus.Models;
using Newtonsoft.Json;
using System.Diagnostics;

namespace veebirakendus.Controllers
{
    public class addBid
    {
        public string Id { get; set; }
        public string Forname { get; set; }
        public string Surname { get; set; }
        public string Amount { get; set; }
    }

    public class BidController : Controller
    {
        [HttpPost]
        public ActionResult Index(addBid addBid)
        {
            string json = new WebClient().DownloadString("http://uptime-auction-api.azurewebsites.net/api/Auction").Replace("product", "").Replace("bidding", "");

            product Product = JsonConvert.DeserializeObject<List<product>>(json).Find(a => a.Id == addBid.Id);

            if (Product == null) return Json("ERROR: Auction has expired");

            bid Bid = new bid
            {
                Product = Product,
                User = new user
                {
                    Forname = addBid.Forname,
                    Surname = addBid.Surname
                },
                BidDate = DateTime.Now,
            };

            if (!float.TryParse(addBid.Amount, out float amount)) return Json("ERROR: Amount has to be a number");

            bool Decimal = false;
            int DecimalPoints = 0;
            foreach (char c in addBid.Amount)
            {
                if (Decimal)
                {
                    DecimalPoints++;
                }
                if (c == char.Parse("."))
                {
                    Decimal = true;
                }
            }

            if (DecimalPoints > 2) return Json("ERROR: Amount can't have more then 2 deciaml spaces");

            Bid.Amount = amount;

            Debug.WriteLine(Bid.User.Forname);
            Debug.WriteLine(Bid.User.Surname);
            Debug.WriteLine(Bid.Amount);

            string path = Path.GetDirectoryName(this.GetType().Assembly.Location) + "/../bids.json";

            List<bid> Bids = new List<bid>();

            if (System.IO.File.Exists(path))
            {
                Bids = JsonConvert.DeserializeObject<List<bid>>(System.IO.File.ReadAllText(path, System.Text.Encoding.UTF8));
            }

            foreach (bid item in Bids)
            {
                if(item.Product.Id == Bid.Product.Id && item.User.Forname == Bid.User.Forname && item.User.Surname == Bid.User.Surname)
                {
                    if (item.Amount > Bid.Amount) return Json("ERROR: You already have a bid with larger amount");
                }
            }

            Bids.Add(Bid);

            System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(Bids));

            return Json("SUCCESS: Your bid was successfull");
        }
    }
}