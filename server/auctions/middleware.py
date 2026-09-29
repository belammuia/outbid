from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError

jwt_auth = JWTAuthentication()


@database_sync_to_async
def get_user_from_token(token):
    try:
        validated_token = jwt_auth.get_validated_token(token)
        return jwt_auth.get_user(validated_token)
    except (AuthenticationFailed, TokenError):
        return AnonymousUser()


class JWTAuthMiddleware:
    """Authenticate WebSocket connections with a JWT access token.

    Looks for the token in the Authorization header first, then falls back
    to the first subprotocol (the only option for browser clients).
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        scope["user"] = AnonymousUser()
        scope["accepted_subprotocol"] = None

        headers = dict(scope.get("headers", []))
        auth_header = headers.get(b"authorization", b"").decode()

        token = None
        if auth_header.startswith("Bearer "):
            token = auth_header[len("Bearer "):]
        else:
            subprotocols = scope.get("subprotocols", [])
            if subprotocols:
                token = subprotocols[0]
                scope["accepted_subprotocol"] = token

        if token:
            scope["user"] = await get_user_from_token(token)

        return await self.app(scope, receive, send)