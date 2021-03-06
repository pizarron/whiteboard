﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Whiteboard.DataAccess.Models;

namespace whiteboard.BusinessLogic.SchoolModule
{
    public interface ICourseTeacherService:IService<CourseTeacher>
    {
        IEnumerable<Profile> GetTeachersByCourseId(int CourseId);
        IEnumerable<Course> GetCoursesByTeacherID(int TeacherID);
    }
}
