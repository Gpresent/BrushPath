"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpacedRepetitionSystem = /** @class */ (function () {
    function SpacedRepetitionSystem() {
        this.items = [];
    }
    SpacedRepetitionSystem.prototype.addItem = function (id) {
        var newItem = {
            id: id,
            repetition: 0,
            interval: 0,
            easeFactor: 1.25,
            nextReviewDate: new Date(),
        };
        this.items.push(newItem);
    };
    SpacedRepetitionSystem.prototype.reviewItem = function (id, quality) {
        var item = this.items.find(function (item) { return item.id === id; });
        if (!item)
            return;
        if (quality >= 3) {
            if (item.repetition === 0) {
                item.interval = 1;
            }
            else if (item.repetition === 1) {
                item.interval = 6;
            }
            else {
                item.interval = Math.ceil(item.interval * item.easeFactor);
            }
            item.repetition++;
        }
        else {
            item.repetition = 0;
            item.interval = 1;
        }
        item.easeFactor = Math.max(1.3, item.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        item.nextReviewDate = new Date(Date.now() + item.interval * 24 * 60 * 60 * 1000);
        console.log("Next review for item ".concat(item.id, " is in ").concat(item.interval, " days."));
        console.log(item.nextReviewDate);
    };
    return SpacedRepetitionSystem;
}());
// Usage example
var spaceSystem = new SpacedRepetitionSystem();
spaceSystem.addItem('1');
spaceSystem.reviewItem('1', 5); // User remembered the item well
spaceSystem.reviewItem('1', 5); // Lower quality response, but still remembered
spaceSystem.reviewItem('1', 5); // User remembered the item well
spaceSystem.reviewItem('1', 0); // Lower quality response, but still remembered
spaceSystem.reviewItem('1', 5); // User remembered the item well
spaceSystem.reviewItem('1', 5); // Lower quality response, but still remembered
spaceSystem.reviewItem('1', 5); // Lower quality response, but still remembered
