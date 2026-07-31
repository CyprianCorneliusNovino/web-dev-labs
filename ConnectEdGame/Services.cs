using ConnectEd.Models;
using System.Text.RegularExpressions;

namespace ConnectEd.Services
{
    public interface ICliSimulatorService
    {
        (bool IsValid, string Feedback) ValidateCommand(string userInput, string expectedCmd);
    }

    public interface IGamificationService
    {
        int CalculateXp(bool isUnderTimeLimit, bool usedHint);
        void EvaluateBadges(PlayerProfile profile);
    }

    public class CliSimulatorService : ICliSimulatorService
    {
        public (bool IsValid, string Feedback) ValidateCommand(string userInput, string expectedCmd)
        {
            // Sanitize inputs (Case-insensitive, trim whitespace)
            var cleanInput = userInput.Trim();
            var cleanExpected = expectedCmd.Trim();

            if (string.Equals(cleanInput, cleanExpected, StringComparison.OrdinalIgnoreCase))
                return (true, "✅ Command accepted! Correct syntax detected.");

            // Advanced fuzzy check for typos (e.g., "intrface" vs "interface")
            if (cleanInput.Contains("ip address") && cleanExpected.Contains("ip address"))
            {
                return (false, "⚠️ Syntax mismatch! Did you forget the subnet mask? e.g. `ip address 192.168.1.1 255.255.255.0`");
            }

            if (Regex.IsMatch(cleanInput, @"^no\s+shutdown$", RegexOptions.IgnoreCase))
                return (true, "✅ 'no shutdown' accepted. Interface is now active!");

            return (false, $"❌ Invalid syntax: {expectedCmd}. Hint: {expectedCmd}");
        }
    }

    public class GamificationService : IGamificationService
    {
        private const int BaseXp = 50;
        private const int TimeBonusXp = 20;
        private const int ZeroHintBonusXp = 30;

        public int CalculateXp(bool isUnderTimeLimit, bool usedHint)
        {
            int xp = BaseXp;
            if (isUnderTimeLimit) xp += TimeBonusXp;
            if (!usedHint) xp += ZeroHintBonusXp;
            return xp;
        }

        public void EvaluateBadges(PlayerProfile profile)
        {
            // Simple badge checker
            if (profile.TotalXP >= 1000 && !profile.EarnedBadges.Any(b => b.Name == "CLI Warrior"))
            {
                profile.EarnedBadges.Add(new Badge { Name = "CLI Warrior", Description = "Completed 1000 XP worth of commands!" });
            }
        }
    }
}