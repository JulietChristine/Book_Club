def create_classes(db):
    class Books(db.Model):
        __tablename__ = 'all_data'

        primary_isbn_13 = db.Column(db.String, primary_key=True)
        list = db.Column(db.String(64))
        weeks_on_list = db.Column(db.Integer)
        publisher = db.Column(db.String(64))
        description = db.Column(db.String)
        list_date = db.Column(db.Date)
        rank_this_week = db.Column(db.Integer)
        primary_isbn_10 = db.Column(db.String(15))
        title = db.Column(db.String)
        author = db.Column(db.String)
        whole_rating = db.Column(db.Integer)
        average_rating = db.Column(db.Float)
        rating_count = db.Column(db.Integer)

        def __repr__(self):
            return '<Books %r>' % (self.name)
    return Books