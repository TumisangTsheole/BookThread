# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /BookThread

# Copy EVERYTHING from your project to the container
COPY . .

# Restore all dependencies
RUN dotnet restore

# Publish only the API
RUN dotnet publish src/BookThread.API/BookThread.API.csproj -c Release -o /BookThread/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY --from=build /BookThread/publish .
ENTRYPOINT ["dotnet", "BookThread.API.dll"]
