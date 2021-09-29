using Newtonsoft.Json;

namespace SB.Web.Controllers.Elements
{
    public class ChangeElementTextCommand
    {
        [JsonConstructor]
        public ChangeElementTextCommand(string newText)
        {
            NewText = newText;
        }

        public string NewText { get; init; }
    }
}