function filterData(data){
	let arr = []
	for(let i = 0;i < data.length;i++){
		if(data[i].type == 2){
			arr.push(data[i])
		}
		if(!data[i].songmid){
			continue;
		}
		let {albummid,songname,singername,songmid,type} = data[i];
		if(data[i].singername){
			var singer = data[i].singername
		}else{
			var singer = data[i].singer[0].name
		}
		let albumUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`
		arr.push({songname,songmid,singer,albummid,albumUrl,type})
	}
	//console.log(arr)
	return arr;
}
module.exports = {filterData}