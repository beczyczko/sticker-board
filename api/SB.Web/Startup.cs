using System.Reflection;
using Autofac;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SB.Boards.Domain;
using SB.Common.Dispatchers;
using SB.Common.MediatR;
using SB.Common.Mongo;
using SB.Common.Mvc;
using SB.SignalR.Board;

namespace SB.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        [UsedImplicitly]
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCustomMvc();

            services.AddOpenApiDocument(configure =>
            {
                configure.DocumentName = "v1";
                configure.Title = "Sticker Board API";
            });

            services.AddControllers();

            services.AddSignalR();

            services.AddOptions();
        }

        [UsedImplicitly]
        public void ConfigureContainer(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(Assembly.GetEntryAssembly()).AsImplementedInterfaces();
            builder.RegisterAssemblyTypes(typeof(Dispatcher).Assembly).AsImplementedInterfaces();
            builder.RegisterAssemblyTypes(typeof(Sticker).Assembly).AsImplementedInterfaces();
            builder.RegisterAssemblyTypes(typeof(BoardHub).Assembly).AsImplementedInterfaces();

            builder.AddDispatchers();
            AddMediatR(builder);
            builder.AddMongo();
            builder.AddMongoRepository<Sticker>("stickers");
        }

        private void AddMediatR(ContainerBuilder builder)
        {
            builder.AddMediatR();

            // how to register mediatr handlers
            // https://github.com/jbogard/MediatR/tree/master/samples/MediatR.Examples.PublishStrategies
            // finally register our custom code (individually, or via assembly scanning)
            // - requests & handlers as transient, i.e. InstancePerDependency()
            // - pre/post-processors as scoped/per-request, i.e. InstancePerLifetimeScope()
            // - behaviors as transient, i.e. InstancePerDependency()
            // builder.RegisterAssemblyTypes(typeof(Startup).GetTypeInfo().Assembly).AsImplementedInterfaces(); // via assembly scan
            // builder.RegisterType<MyHandler>().AsImplementedInterfaces().InstancePerDependency();
        }

        [UsedImplicitly]
        public void Configure(
            IApplicationBuilder app,
            IWebHostEnvironment env,
            IMongoDbInitializer mongoDbInitializer)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors(builder =>
                builder.SetIsOriginAllowed(host => true).AllowAnyHeader().AllowAnyMethod().AllowCredentials());

            app.UseHttpsRedirection();

            app.UseOpenApi();
            app.UseSwaggerUi3();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapHub<BoardHub>("/board");
            });
            
            mongoDbInitializer.InitializeAsync();
        }
    }
}