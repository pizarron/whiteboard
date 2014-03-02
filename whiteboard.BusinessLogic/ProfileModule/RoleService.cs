﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Whiteboard.DataAccess.Models;
using Whiteboard.DataAccess.Repositories;

namespace whiteboard.BusinessLogic.ProfileModule
{
    public class RoleService:GenericService<Role>,IRoleService
    {
        private RoleService(IRoleRepository da):base(da)
        {

        }
        public static IRoleService GetInstance<T>() where  T:IRoleRepository
        {
            IRoleRepository da = (IRoleRepository)Activator.CreateInstance<T>();
            return new RoleService(da);
        }
    }
}
