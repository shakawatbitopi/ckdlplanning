using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualBasic;
using Microsoft.VisualBasic.CompilerServices;

namespace Common
{
    public class Encryption
    {
        private bool IsValidUser = false;


        public Encryption()
        {
            //this.PopulateErrorString();
            this.IsValidUser = true;
        }
        public string EncryptWord(string EncryptIt)
        {
            return this.EncryptWord(EncryptIt, "");
        }

        public string DecryptWord(string DecryptIt)
        {
            return this.DecryptWord(DecryptIt, "");
        }

        public string DecryptWord(string DecryptIt, string Weight)
        {
            string str3 = "";
            if (!this.IsValidUser)
            {
                throw new Exception("You can't use it without permission.");
            }

            if (Strings.Len(Strings.Trim(DecryptIt)) == 0)
            {
                return "";
            }
            long num2 = this.ReturnWeight(Weight);

            VBMath.Rnd(-1f);
            if (Strings.Len(Strings.Trim(Weight)) == 0)
            {
                VBMath.Randomize(5.0);
            }
            else
            {
                VBMath.Randomize((double)num2);
            }
            for (long i = 1L; i <= Strings.Len(DecryptIt); i += 1L)
            {
                long num = Strings.Asc(Strings.Mid(DecryptIt, (int)i, 1)) - ((int)Math.Round((double)((100f * VBMath.Rnd()) + 1f)));
                if (num > 0xffL)
                {
                    num -= 0xffL;
                }
                if (num < 1L)
                {
                    num += 0xffL;
                }
                str3 = str3 + StringType.FromChar(Strings.Chr((int)num));
            }
            return str3;
        }


        public string EncryptWord(string EncryptIt, string Weight)
        {
            string str3 = "";
            if (!this.IsValidUser)
            {
                throw new Exception("The encryption engine is only for KORMEE.");
            }
            if (Strings.Len(Strings.Trim(EncryptIt)) == 0)
            {
                return "";
            }
            long num2 = this.ReturnWeight(Weight);
            VBMath.Rnd(-1f);
            if (Strings.Len(Strings.Trim(Weight)) == 0)
            {
                VBMath.Randomize(5.0);
            }
            else
            {
                VBMath.Randomize((double)num2);
            }
            for (long i = 1L; i <= Strings.Len(EncryptIt); i += 1L)
            {
                long num = Strings.Asc(Strings.Mid(EncryptIt, (int)i, 1)) + ((int)Math.Round((double)((100f * VBMath.Rnd()) + 1f)));
                if (num > 0xffL)
                {
                    num -= 0xffL;
                }
                if (num < 1L)
                {
                    num += 0xffL;
                }
                str3 = str3 + StringType.FromChar(Strings.Chr((int)num));
            }
            return str3;
        }

        private long ReturnWeight(string Weight)
        {
            object obj2 = null;
            for (long i = 1L; i <= Strings.Len(Weight); i += 1L)
            {
                obj2 = ObjectType.AddObj(obj2, Strings.Asc(Strings.Mid(Weight, (int)i, 1)));
            }
            return LongType.FromObject(obj2);
        }
    }
}
