/* eslint-disable require-jsdoc */
class Animal {
  constructor(id, name, imageUrl, username, taggedAnimals) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.username = username;
    this.taggedAnimals = taggedAnimals;
    this.species = "";
    this.description = "";
    this.facts = [];
    // Animal gets default score of 1 on upload
    this.score = 1;
  }
}

module.exports = Animal;
