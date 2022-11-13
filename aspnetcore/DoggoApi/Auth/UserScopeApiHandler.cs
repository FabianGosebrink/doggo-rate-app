using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace DoggoApi
{
    public class UserApiScopeHandler : AuthorizationHandler<UserApiScopeHandlerRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
            UserApiScopeHandlerRequirement requirement)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }
            if (requirement == null)
            {
                throw new ArgumentNullException(nameof(requirement));
            }

            Claim scopeClaim = context.User.Claims.FirstOrDefault(t => t.Type == "scope");

            if (scopeClaim == null)
            {
                return Task.CompletedTask;
            }

            string[] scopes = scopeClaim.Value.Split(" ", StringSplitOptions.RemoveEmptyEntries);

            bool hasScope = scopes.Any(t => t == requirement.Scope);

            if (hasScope)
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            return Task.CompletedTask;
        }

    }
}
