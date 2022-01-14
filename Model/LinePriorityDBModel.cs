using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class LinePriorityDBModel
    {
        public int PRLineID { get; set; }
        public string PRID { get; set; }
        public string LineNumber { get; set; }
        public string PlanStartDate { get; set; }
        public string PriorityNo { get; set; }
        public LinePriorityNumberDBModel[] arrLinePriorityDBModel { get; set; }
    }
    public class LinePriorityNumberDBModel
    {
        public int PRLineID { get; set; }
        public int PriorityNo { get; set; }
    }
}
