using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class EfficeincyMatrixDBModel
    {
        public int PRMasterID { get; set; }
        public int PRWiseEfficiencyID { get; set; }
        public string PRID { get; set; }
        public string CompanyID { get; set; }
        public string CompanyName { get; set; }
        public string StyleType { get; set; }
        public string StyleCriticality { get; set; }
        public string MatrixType { get; set; }
        public int EfficiencyID { get; set; }
        public int LineNumber { get; set; }
        public int TargetQty { get; set; }
        public int PRMatrixID { get; set; }
        public int StartDay { get; set; }
        public int EndDay { get; set; }
        public int HourlyProduction { get; set; }
        public int DailyProduction { get; set; }
        public int Days { get; set; }
        public decimal Efficiency { get; set; }
        public decimal SAM { get; set; }
        public int TotalWorkStation { get; set; }
        public decimal OrgEfficiency { get; set; }
        public decimal MinSMV { get; set; }
        public decimal MaxSMV { get; set; }
    }
}
