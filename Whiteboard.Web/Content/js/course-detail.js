﻿(function ($) {
    $(document).ready(function () {
        $('#add-student').on('click', addStudent);
        $('#student-name').autocomplete({
            serviceUrl: '/course/students',
            noCache: true,
            onSelect: function (info) {
                console.log(info.data + " " + info.value);
                $('#studentId').val(info.data);
            }
        });
        $(document.body).on('click', 'a[data-student-id]', deleteStudent);
        $('#start-class').on('click', startClass);

        startClassManager();
    });
    var startClass = function (e) {
        if (confirm("Do you want to start a class?")) {
            var courseId = $('#hiddenCourseId').val();
            var data = {
                courseId: courseId
            };
            $.post('/courseclass/start', data).done(function (res) {
                if (res.status === 'ok') {
                    window.location = "/course/courseclass/" + res.courseClassId;
                }
            });
        }
    },
    deleteStudent = function(e) {
        e.preventDefault();
        var studentId = e.currentTarget.dataset.studentId;
        data = { courseStudentId: studentId };
        $.post('/course/student/delete', data).done(function(res) {
            e.currentTarget.parentNode.parentNode.remove();
        });
    },
    addStudent = function (e) {
        e.preventDefault();
        var studentId = $('#studentId').val();
        $('#studentId').val('');
        $('#student-name').val('');
        var data = {
            'studentId': studentId
        };
        $.post('/course/addstudent', data).done(function (res) {
            var tpl = '';
            tpl += '<tr>';
            tpl += '<td>' + res.name + '</td>';
            tpl += '<td><a href="#" data-student-id="' + res.id + '"><i class="fa fa-trash-o fa-lg"></i></a></td>';
            tpl += '</tr>';

            $('#students-tbody').append(tpl);
        });
    },
    startClassManager = function () { 
        initializeDateComponents();
        $('#add-class').on('click', addClass);
        formatDates();
        registerDeleteClassEvents();
    },
    initializeDateComponents = function () {
        $('#timepicker1').timepicker({
            showMeridian: false
        });

        $('#timepicker2').timepicker({
            showMeridian: false
        });

        $('#sandbox-container input').datepicker({
            autoclose: true,
            todayHighlight: true,
            startDate: new Date()
        }).datepicker("setDate", new Date());
    },
    addClass = function (e) {
        e.preventDefault();
        // class-desc, class-date, timepicker1
        var description = $('#class-desc').val();
        var hour1 = $('#timepicker1').data('timepicker').hour;
        var minute1 = $('#timepicker1').data('timepicker').minute;
        var hour2 = $('#timepicker2').data('timepicker').hour;
        var minute2 = $('#timepicker2').data('timepicker').minute;
        var date1 = $('#sandbox-container input').datepicker("getDate");
        var date2 = $('#sandbox-container input').datepicker("getDate");
        date1.setMinutes(minute1);
        date1.setHours(hour1);
        date1.setSeconds(0);
        date2.setMinutes(minute2);
        date2.setHours(hour2);
        date2.setSeconds(0);

        var courseId = $('#courseId').val();
        var data = {
            courseId: courseId,
            description: description,
            beginTime: date1.getTime(),
            endTime: date2.getTime()
        }

        $.post('/course/addclass/', data).done(function (data) {
            Messenger.options = {
                extraClasses: 'messenger-fixed messenger-on-top messenger-on-right',
                theme: 'flat',
                hideAfter: 1
            };
            var msg = Messenger().post({
                message: 'Class added successfully!',
                id: "Only-one-message",
                type: 'success',
                showCloseButton: true
            });
            setTimeout(function () {
                msg.hide();
            }, 1700);
            var row = "<tr>";
            row += "<td>" + data.description + "</td>";
            row += "<td>" + formatFromSpoch(data.begin) + "</td>";
            row += "<td>" + formatFromSpoch(data.end) + "</td>";
            row += "<td><a href=\"#\" data-class-id=\"" + data.id + "\"><i class=\"fa fa-trash-o fa-lg\"></i></a></td>";
            row += "</tr>";

            $('#classes-tbody').append(row);
        }, 'json');
    }
    registerDeleteClassEvents = function () {
        $(document.body).on('click', 'a[data-class-id]', function (e) {
            e.preventDefault();
            var classId = e.currentTarget.dataset.classId;
            data = { classId: classId };
            $.post('/course/class/delete', data).done(function (res) {
                Messenger.options = {
                    extraClasses: 'messenger-fixed messenger-on-top messenger-on-right',
                    theme: 'flat'
                };
                var msg = Messenger().post({
                    message: 'Class deleted successfully!',
                    id: "Only-one-message",
                    type: 'info',
                    showCloseButton: true
                });
                setTimeout(function () {
                    msg.hide();
                }, 1700);
            });
            e.currentTarget.parentNode.parentNode.remove();
        });
    },
    formatDates = function () {
        var items = document.getElementsByClassName('format-date');
        for (var i = 0; i < items.length; ++i) {
            var format = formatFromSpoch(parseInt(items[i].innerHTML));

            items[i].innerHTML = format;
        }
    },
    formatFromSpoch = function (time) {
        var date = new Date();
        date.setTime(time);

        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getFullYear();
        var hour = date.getHours();
        var minute = date.getMinutes();
        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        var format = month + "/" + day + "/" + year + " - " + hour + ":" + minute;
        return format;
    }
}).call(document, jQuery);