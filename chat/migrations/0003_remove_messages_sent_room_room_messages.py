# Generated by Django 5.1.3 on 2024-11-25 19:31

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chat", "0002_alter_messages_sent_room"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="messages",
            name="sent_room",
        ),
        migrations.AddField(
            model_name="room",
            name="messages",
            field=models.ManyToManyField(
                related_name="room_messages", to="chat.messages"
            ),
        ),
    ]
