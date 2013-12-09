            //demo page script


            $(document).ready(function() {
                $(".button").button();
                $.getJSON("https://api.stackoverflow.com/1.0/tags/?jsonp=?&pagesize=50", function(data) {
                    $("#grid").wijgrid({
                        allowSorting: true,
                        allowPaging: true,
                        data: data.tags,
                        columns: [
                            {headerText: "Tag"},
                            {headerText: "Questions", dataType: "number", dataFormatString: "n0"},
                            {headerText: "fullfills", visible: false}]
                    });
                    var series = [];
                    for (var i = 0; i < 10; i++) {
                        var slice = {
                            label: data.tags[i].name,
                            legendEntry: true,
                            data: data.tags[i].count,
                            offset: 0
                        };
                        series.push(slice);
                    }
                    $("#tagPie").wijpiechart({
                        textStyle: {fill: "#ffffff", "font-family": "Georgia", "font-size": "12pt", stroke: "none"},
                        chartLabelStyle: {fill: "#242122", "font-family": "Georgia", "font-size": "14pt", stroke: "none"},
                        hint: {
                            contentStyle: {"font-family": "Georgia", "font-size": "14px", stroke: "none"},
                            content: function() {
                                return this.data.label + " : " + Globalize.format(this.value / this.total, "p2");
                            }
                        },
                        header: {
                            text: "Top 10 Tags on Stack Overflow",
                            visible: false
                        },
                        seriesList: series, seriesStyles: [{
                                fill: "180-rgb(255,15,3)-rgb(212,10,0)", stroke: "#FFFFFF", "stroke-width": "2"
                            }, {
                                fill: "90-rgb(255,102,0)-rgb(255,117,25)", stroke: "#FFFFFF", "stroke-width": "2"
                            }, {
                                fill: "90-rgb(255,158,1)-rgb(255,177,53)", stroke: "#FFFFFF", "stroke-width": "2"
                            }, {
                                fill: "90-rgb(252,210,2)-rgb(255,215,29)", stroke: "#FFFFFF", "stroke-width": "2"
                            }, {
                                fill: "90-rgb(248,255,1)-rgb(248,255,39)", stroke: "#FFFFFF", "stroke-width": "2"
                            }, {
                                fill: "90-rgb(189,240,10)-rgb(176,222,9)", stroke: "#FFFFFF", "stroke-width": "2"
                            }, {
                                fill: "90-rgb(4,210,21)-rgb(6,224,21)", stroke: "#FFFFFF", "stroke-width": "2"
                            }, {
                                fill: "90-rgb(13,142,207)-rgb(17,157,229)", stroke: "#FFFFFF", "stroke-width": "2"
                            }, {
                                fill: "90-rgb(13,82,209)-rgb(14,94,226)", stroke: "#FFFFFF", "stroke-width": "2"
                            }, {
                                fill: "90-rgb(42,12,208)-rgb(50,15,225)", stroke: "#FFFFFF", "stroke-width": "2"
                            }]

                    });
                });
                $.getJSON("https://api.stackoverflow.com/1.0/stats/?jsonp=?", function(data) {
                    var statNames = ["Questions", "Unanswered", "Accepted", "Answers"];
                    var statVals = [data.statistics[0].total_questions, data.statistics[0].total_unanswered, data.statistics[0].total_accepted, data.statistics[0].total_answers];
                    $("#siteBar").wijbarchart({
                        textStyle: {fill: "#242122", "font-family": "Georgia", "font-size": "12pt", stroke: "none"},
                        chartLabelStyle: {fill: "#242122", "font-family": "Georgia", "font-size": "14pt", stroke: "none"},
                        horizontal: false,
                        axis: {
                            y: {
                                text: ""
                            },
                            x: {
                                text: "",
                                labels: {
                                    textAlign: "near",
                                    style: {
                                        rotation: -45
                                    }
                                }
                            }
                        },
                        hint: {
                            contentStyle: {"font-family": "Georgia", "font-size": "14px", stroke: "none"},
                            content: function() {
                                return this.x + ': ' + this.y + '';
                            }
                        },
                        header: {
                            text: "Stack Overflow Stats",
                            visible: false
                        },
                        seriesList: [
                            {
                                label: "Stats",
                                legendEntry: false,
                                fitType: "spline",
                                data: {
                                    x: statNames,
                                    y: statVals
                                }
                            }
                        ],
                        seriesStyles: [
                            {fill: "#00A6DD", stroke: "#FFFFFF"}
                        ]
                    });
                });

                $.getJSON("https://api.stackoverflow.com/1.0/users/?jsonp=?&pagesize=1", function(data) {
                    var userSeriesList = [];
                    idx = 0;
                    var fd = new Date();
                    td = new Date();
                    fromDate = 0;
                    toDate = 0;
                    fd.setDate(fd.getDate() - 1);
                    fromDate = Math.round(fd.getTime() / 1000);
                    toDate = Math.round(td.getTime() / 1000);

                    for (var i = 0; i < data.users.length; i++) {
                        var url = "https://api.stackoverflow.com/1.0/users/" + data.users[i].user_id + "/reputation?jsonp=?&pagesize=8";
                        $.getJSON(url, function(datax) {
                            var repDates = [];
                            var repPoints = [];
                            var rep = data.users[idx].reputation;
                            for (var ix = 0; ix < datax.rep_changes.length; ix++) {
                                var d = new Date();
                                d.setTime(datax.rep_changes[ix].on_date * 1000);
                                repDates.push(d);
                                rep = rep - datax.rep_changes[ix].positive_rep + datax.rep_changes[ix].negative_rep;
                                repPoints.push(rep);
                            }
                            var userSeries = {
                                label: data.users[idx].display_name,
                                legendEntry: true,
                                data: {
                                    x: repDates,
                                    y: repPoints
                                },
                                markers: {
                                    visible: true,
                                    type: "circle"
                                }
                            };
                            userSeriesList.push(userSeries);
                            if (idx == data.users.length - 1) {
                                $("#tagLines").wijlinechart({
                                    textStyle: {fill: "#242122", "font-family": "Georgia", "font-size": "12pt", stroke: "none"},
                                    chartLabelStyle: {fill: "#242122", "font-family": "Georgia", "font-size": "14pt", stroke: "none"},
                                    axis: {
                                        y: {
                                            text: "Rep"
                                        },
                                        x: {
                                            text: "",
                                            labels: {
                                                textAlign: "near",
                                                style: {
                                                    rotation: -45
                                                }
                                            }
                                        }
                                    },
                                    hint: {
                                        contentStyle: {"font-family": "Georgia", "font-size": "14px", stroke: "none"},
                                        content: function() {
                                            return this.data.lineSeries.label + " : " + this.y;
                                        }
                                    },
                                    header: {
                                        text: "Top Users",
                                        visible: false
                                    },
                                    seriesList: userSeriesList,
                                    seriesStyles: [
                                        {stroke: "#00A6DD", "stroke-width": "4"}
                                    ]
                                });
                            }
                            idx++;
                        });
                    }
                });
            });
