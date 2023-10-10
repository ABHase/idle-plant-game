export class Game {
    totalTime = 0;

    update(diff: number) {
      this.totalTime += diff;
    }
}