function filterData(data){
	let {songlist,topinfo} = data
	//console.log(songlist,topinfo)
	let arr = []
	for(let i = 0;i < songlist.length;i++){
		let {albummid,songname,singername,songmid} = songlist[i].data;
		singer = songlist[i].data.singer[0].name
		let albumUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`
		arr.push({songname,songmid,singer,albummid,albumUrl})
	}
	//console.log(arr)
	return arr;
}
module.exports = {filterData}