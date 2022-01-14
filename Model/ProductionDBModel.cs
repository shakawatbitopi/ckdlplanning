using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class ProductionDBModel
    {
        public string PRMasterID { get; set; }
        public string PRID { get; set; }
        public string FileRefID { get; set; }
        public string FileRefNo { get; set; }
        public string PlanDate { get; set; }
        public string TargetQty { get; set; }
        public string ProduceQty { get; set; }
        public string RemainingQty { get; set; }
        public string DayQty { get; set; }
        public string LineNumber { get; set; }
        public string UnitID { get; set; }
        public string UnitName { get; set; }
        public string PlannedProduction { get; set; }
        public string StyleName { get; set; }
        public string ID { get; set; }
        public string Status { get; set; }
        public string Code { get; set; }
        public string Value { get; set; }
        public string CompanyID { get; set; }
        public string CompanyName { get; set; }
        public int TotalProduceQty { get; set; }
        public int BalanceQty { get; set; }
    }
}
