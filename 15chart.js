function getChart(p, field, type) {
	chartExpand.expanded = true;
	var name;
	var str = data.NAME_2;
	var tChart = echarts.init(document.getElementById("box"));
	var barxValue = [2012, 2013, 2014, 2015, 2016];
	if (field == "GDP") {
		name = "亿元";
		str += "历年GDP统计图";
	} else if (field == "GDP增速") {
		name = "%";
		str += "历年GDP增速统计图";
	} else if (field == "人口POP") {
		name = "万";
		str += "人口POP统计图";
	}
	var option = {
		title: {
			left: "center",
			text: str
		},
		xAxis: {
			type: 'category',
			data: barxValue,
			axisTick: {
				alignWithLabel: true
			}
		},
		yAxis: {
			name: name,
			type: 'value',
			axisLabel: {
				margin: 2,
				show: true,
				interval: 'auto'
			}
		},
		grid: {
			left: 60
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		series: [{
			name: field,
			data: p,
			type: type
		}]
	};

	tChart.clear();
	tChart.setOption(option);
}
