var sprite = require('sprity');


var options = {
	//输出路径
	out: 'less/sprite/',
	//获取路径
	src: 'images/icon/*/*.png',
	//生成less名称
	style: 'less',
	//生成类型
	processor: 'less',
	//图片引擎
	engine: 'sprity-gm',
	//按照文件夹split
	split: true
}
sprite.create(options, function() {
	console.log('done');
});