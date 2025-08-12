import json
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient


class AuthFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_login_me(self):
        # register
        r = self.client.post(reverse('auth-register'), {"email":"t@example.com","password":"secret123"}, format='json')
        self.assertEqual(r.status_code, 201, r.content)
        access = r.data['access']

        # me
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        r2 = self.client.get(reverse('users-me'))
        self.assertEqual(r2.status_code, 200, r2.content)
        self.assertEqual(r2.data['email'], 't@example.com')

        # login
        self.client.credentials()
        r3 = self.client.post(reverse('auth-login'), {"email":"t@example.com","password":"secret123"}, format='json')
        self.assertEqual(r3.status_code, 200, r3.content)
        self.assertIn('access', r3.data)
