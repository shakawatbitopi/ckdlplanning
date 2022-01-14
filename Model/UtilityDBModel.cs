using Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class UtilityDBModel
    {
        public string PRMasterID { get; set; }
        public string LineNumber { get; set; }
        public string PRID { get; set; }
        public string LineStartDate { get; set; }
        public string PlanStartDate { get; set; }
        public string PlanEndDate { get; set; }
        public string TargetQty { get; set; }
        public string PriorityNo { get; set; }
        public string FileRefID { get; set; }
        public string FileOriginID { get; set; }
        public string Buyer { get; set; }
        public string StyleName { get; set; }
        public string FileCategory { get; set; }
        public string FileStatus { get; set; }
        public string CompanyID { get; set; }
        public string CompanyName { get; set; }
        public string UnitName { get; set; }
        public int OrderQty { get; set; }
        public int Operator { get; set; }
        public int Helper { get; set; }
        public int WorkStation { get; set; }
        public int YearNo { get; set; }
    }
}
