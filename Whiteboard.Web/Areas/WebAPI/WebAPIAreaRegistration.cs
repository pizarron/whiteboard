﻿using System.Web.Mvc;

namespace Whiteboard.Web.Areas.WebAPI {
    public class WebAPIAreaRegistration : AreaRegistration {
        public override string AreaName {
            get {
                return "WebAPI";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) {
            context.MapRoute(
                "WebAPI_default",
                "api/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
