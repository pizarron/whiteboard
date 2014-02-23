﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Whiteboard.Web.Controllers {
    [Authorize]
    public class DashboardController : Controller {
        [HttpGet]
        public ActionResult Index() {
            return View();
        }
    }
}