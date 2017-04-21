export default{
	changeDate(timeString){
		const timeDate=new Date(parseInt(timeString)).toLocaleString().replace(/\//g, "-").replace(/下|上/g, " ").substring(0, 10);
		return timeDate;
	},
	resetLocalDate(user, newval){
		localStorage.setItem(user, JSON.stringify(newval))
	},
	getLocalDate(key){
		return JSON.parse(localStorage.getItem(key)) 
	},
	selectLocalDate(user, id){
		let Blog=JSON.parse(localStorage.getItem(user))
		return Blog.filter((item)=> item.id==id)
	},
	checkUserLogin(user, password){
		let usesrArr=this.getLocalDate('usesrArr');
		if(usesrArr){
			if(usesrArr.hasOwnProperty(user)&&usesrArr[user]==password){
				return true
			}
		}
		return false;
	},
	checkUserRidgest(user){
		let usesrArr=this.getLocalDate('usesrArr');
		if(usesrArr){
			if(usesrArr.hasOwnProperty(user)){
				return false
			}
		}
		return true
	}

}
