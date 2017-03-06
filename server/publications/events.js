
// Publication de la collection Events pour 
// utilisation / affichage côté client et serveur
Meteor.publish('events', function (start, end) {
  check(start, Date);
  check(end, Date);

  return Events.find({
    $or: [{
      start: { $lte: end }
    },
    {
      end: { $gte: start }
    }],
    $or: [{
      isPrivate: false
    },
    {
      isPrivate: true,
      ownerId: this.userId
    }]
  });
});