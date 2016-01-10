using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MySchool.Models;

namespace MySchool.Controllers
{
    public class HomeController : Controller
    {
        private ADVENTUREWORKSEntities db = new ADVENTUREWORKSEntities();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            return View();
        }

        public JsonResult Load(int index = 0, int count = 200)
        {
            this.HttpContext.Response.Expires = 0;

            int totalRecords = db.People.Count();

            IQueryable<Person> tmp = db.People.OrderBy(t => t.BusinessEntityID).Skip(index).Take(count);

            int n = 0;
            if (0 <= index && index < totalRecords)
            {
                n = Math.Min(count, totalRecords - index);
            }

            return Json(new
            {
                start = index,
                count = n,
                total = totalRecords,
                data = tmp,
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadAll(int index = 0)
        {
            this.HttpContext.Response.Expires = 0;

            int totalRecords = db.People.Count();

            IQueryable<Person> tmp = db.People.OrderBy(t => t.BusinessEntityID).Skip(index).Take(totalRecords);

            return Json(new
            {
                start = index,
                count = totalRecords,
                total = totalRecords,
                data = tmp,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Create(Person[] contact)
        {
            try
            {
                int maxId = 0;
                IQueryable<Person> max = db.People.OrderByDescending(t => t.BusinessEntityID).Take(1);
                foreach (Person p in max)
                {
                    maxId = p.BusinessEntityID;
                }
                foreach (Person ps in contact)
                {
                    ps.BusinessEntityID = ++maxId;
                    db.People.AddObject(ps);
                }
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    data = "",
                    success = false,
                    message = ex.Message
                });
            }

            return Json(new
            {
                data = contact,
                success = true,
                message = "Create method called successfully"
            });
        }

        [HttpPost]
        public JsonResult Delete(Person contact)
        {
            Person t = db.People.Single(c => c.BusinessEntityID == contact.BusinessEntityID);
            db.People.DeleteObject(t);
            db.SaveChanges();

            return Json(new
            {
                data = contact,
                success = true,
                message = "Delete method called successfully"
            });
        }

        [HttpPost]
        public JsonResult Update(Person contact)
        {
            try
            {
                //// Get around DateTime issue. We just ignore the ModifiedDate changes.
                //Contact t = db.Contacts.Single(c => c.ContactID == contact.ContactID);
                //contact.ModifiedDate = t.ModifiedDate;
                //db.Contacts.Detach(t);
                //// -----------------------------------------------------------------------------------

                db.People.Attach(contact);
                db.ObjectStateManager.ChangeObjectState(contact, System.Data.EntityState.Modified);
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Json(new
            {
                data = contact,
                success = true,
                message = "Update method called successfully"
            });
        }

        [HttpPost]
        public JsonResult UpdateAll(Person[] contact)
        {
            try
            {
                //// Get around DateTime issue. We just ignore the ModifiedDate changes.
                //Contact t = db.Contacts.Single(c => c.ContactID == contact.ContactID);
                //contact.ModifiedDate = t.ModifiedDate;
                //db.Contacts.Detach(t);
                //// -----------------------------------------------------------------------------------

                foreach (Person ps in contact)
                {
                    db.People.Attach(ps);
                    db.ObjectStateManager.ChangeObjectState(ps, System.Data.EntityState.Modified);
                }
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Json(new
            {
                data = contact,
                success = true,
                message = "Update method called successfully"
            });
        }

        public JsonResult Sort()
        {
            this.HttpContext.Response.Expires = 0;

            int totalRecords = db.People.Count();

            IQueryable<Person> tmp = db.People.OrderByDescending(t => t.FirstName).Take(totalRecords);

            return Json(new
            {                
                data = tmp,
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
