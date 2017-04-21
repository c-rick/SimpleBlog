export const Show_Blog="Show_Blog";
export const Add_Blog="Add_Blog";
export const Update_Blog="Update_Blog";
export const Delet_Blog="Delet_Blog";
export const Log_In="Log_In";
export const Log_Out="Log_Out";
export const Rigest_In="Rigest_In";
export const Change_Now="Change_Now";

export function showBlog(text){
	return {
		type:Show_Blog,
		text
	}
}
export function addBlog( text){
	return {
		type:Add_Blog,
		text
	}
}
export function updateBlog(text){
	return {
		type:Update_Blog,
		text
	}
}
export function deleteBlog(text){
	return {
		type:Delet_Blog,
		text
	}
}
export function rigestIn(name, nowname){
	return {
		type:Rigest_In,
		name,
		nowname
	}
}
export function changeNow(nowname){
	return {
		type:Change_Now,
		nowname
	}
}
export function login(name, nowname){
	return {
		type:Log_In,
		name,
		nowname
	}
}
export function logout(){
	return {
		type:Log_Out,
	}
}