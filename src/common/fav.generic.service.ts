export class Fav {
  private readonly entity = new Set<string>();

  addFav(id: string) {
    this.entity.add(id);
  }

  deleteFav(id: string) {
    this.entity.delete(id);
  }

  getFavIds() {
    return Array.from(this.entity.values());
  }
}
