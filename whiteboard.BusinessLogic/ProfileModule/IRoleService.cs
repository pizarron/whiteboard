﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Whiteboard.DataAccess.Models;

namespace whiteboard.BusinessLogic.ProfileModule
{
    public interface IRoleService:IService<Role>
    {
        Role GetByName(string name);
    }
}
