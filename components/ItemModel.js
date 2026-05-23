export class LostFoundItem {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.status = data.status;
    this.reportStatus = data.reportStatus || 'Active';
    this.category = data.category;
    this.location = data.location;
    this.description = data.description;
    this.image = data.image;
    this.date = data.date || data.createdAt;
    this.createdAt = data.createdAt || data.date;
    this.resolvedAt = data.resolvedAt;
    this.contactAction = data.contactAction || (this.status === 'Found' ? 'Claim' : 'Found it?');
    this.contactEmail = data.contactEmail;
    this.contactPhone = data.contactPhone;
    this.postedBy = data.postedBy;
    this.postedByName = data.postedByName || 'Guest';
    this.ownerId = data.ownerId;
  }

  get isResolved() {
    return this.reportStatus === 'Resolved';
  }

  matchesQuery(query) {
    if (!query) return true;
    const keyword = query.toLowerCase();
    return (
      this.title.toLowerCase().includes(keyword) ||
      this.description.toLowerCase().includes(keyword) ||
      this.location.toLowerCase().includes(keyword)
    );
  }

  matchesLocation(location) {
    return location === 'All Location' || this.location === location;
  }

  matchesCategory(category) {
    return category === 'All Category' || this.category === category;
  }

  matchesStatus(status) {
    if (status === 'Lost & found') return true;
    return this.status === status;
  }
}
