from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Workout, Leaderboard
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Clear existing data
        Activity.objects.all().delete()
        Workout.objects.all().delete()
        Leaderboard.objects.all().delete()
        User.objects.all().delete()
        Team.objects.all().delete()

        # Create Teams
        marvel = Team.objects.create(name='Marvel', description='Marvel superheroes')
        dc = Team.objects.create(name='DC', description='DC superheroes')

        # Create Users
        users = [
            User.objects.create(name='Spider-Man', email='spiderman@marvel.com', team=marvel),
            User.objects.create(name='Iron Man', email='ironman@marvel.com', team=marvel),
            User.objects.create(name='Wonder Woman', email='wonderwoman@dc.com', team=dc),
            User.objects.create(name='Batman', email='batman@dc.com', team=dc),
        ]

        # Create Activities
        Activity.objects.create(user=users[0], type='Running', duration=30, date='2023-01-01')
        Activity.objects.create(user=users[1], type='Cycling', duration=45, date='2023-01-02')
        Activity.objects.create(user=users[2], type='Swimming', duration=60, date='2023-01-03')
        Activity.objects.create(user=users[3], type='Yoga', duration=40, date='2023-01-04')

        # Create Workouts
        Workout.objects.create(
            name='Hero Circuit',
            description='Strength and endurance training for heroes',
            suggested_for=[users[0].email, users[2].email],
        )
        Workout.objects.create(
            name='Power Flow',
            description='Dynamic full body workout for hero teams',
            suggested_for=[users[1].email, users[3].email],
        )

        # Create Leaderboard
        Leaderboard.objects.create(team=marvel, score=150)
        Leaderboard.objects.create(team=dc, score=120)

        # Ensure unique index on email
        client = MongoClient('mongodb://localhost:27017/')
        db = client['octofit_db']
        db['users'].create_index('email', unique=True)
        client.close()

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
