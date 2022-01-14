using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class UserAccessDBModel
    {
        public int PRUserAccessID { get; set; }
        public string CompanyID { get; set; }
        public string EmployeeCode { get; set; }
        public string EMPList { get; set; }
        public string Name { get; set; }
        public string SLNO { get; set; }
        public string UserCode { get; set; }
        public string Email { get; set; }
        public string CompanyName { get; set; }
    }

    public class MasterDDL
    {
        public List<DDLModel> CompanyList { get; set; }
        public List<DDLModel> EmpList { get; set; }
    }

    public class DDLModel
    {
        public string Code { get; set; }
        public string Value { get; set; }
    }
}
