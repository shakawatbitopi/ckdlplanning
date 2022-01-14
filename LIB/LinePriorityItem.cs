using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LIB
{
    public class LinePriorityItem
    {
        LinePriorityList _objList;
        public List<LinePriorityDBModel> LoadProductionLines()
        {
            _objList = new LinePriorityList();
            List<LinePriorityDBModel> _modelList = new List<LinePriorityDBModel>();
            try
            {
                DataTable dt = _objList.LoadProductionLines();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new LinePriorityDBModel
                                  {
                                      LineNumber = row["LineNumber"].ToString()
                                  }).ToList();
                }
                return _modelList;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }
        public List<LinePriorityDBModel> LoadLineWisePriority(LinePriorityDBModel _dbModel)
        {
            _objList = new LinePriorityList();
            List<LinePriorityDBModel> _modelList = new List<LinePriorityDBModel>();
            try
            {
                DataTable dt = _objList.LoadLineWisePriority(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new LinePriorityDBModel
                                  {
                                      PRLineID = Convert.ToInt32(row["PRLineID"].ToString()),
                                      PRID = row["PRID"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      PlanStartDate = row["PlanStartDate"].ToString(),
                                      PriorityNo = row["PriorityNo"].ToString(),
                                  }).ToList();
                }
                return _modelList;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }

        public int UpdateLinePriorityNumber(LinePriorityDBModel _dbModel)
        {
            try
            {
                _objList = new LinePriorityList();
                return _objList.UpdateLinePriorityNumber(_dbModel);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _objList = null;
            }
        }
    }
}
