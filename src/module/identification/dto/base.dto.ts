export class BaseRequestDto {
	uid: string;

	prepParams(uid: string) {
		this.uid = uid;
	}
}
