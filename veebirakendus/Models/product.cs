using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace veebirakendus.Models
{
    public class product
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime EndDate { get; set; }
    }
}