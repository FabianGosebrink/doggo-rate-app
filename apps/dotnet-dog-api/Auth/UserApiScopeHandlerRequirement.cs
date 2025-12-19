using Microsoft.AspNetCore.Authorization;

public class UserApiScopeHandlerRequirement : IAuthorizationRequirement
{
    public string Scope { get; }


    public UserApiScopeHandlerRequirement(string scope)
    {
        Scope = scope;
    }
}