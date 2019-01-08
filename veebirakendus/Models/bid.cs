using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using veebirakendus.Models;

namespace veebirakendus.Models
{
    public class bid
    {
        public product Product { get; set; }
        public user User { get; set; }
        public DateTime BidDate { get; set; }
        public float Amount { get; set; }
    }
}