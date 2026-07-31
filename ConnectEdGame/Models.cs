using System.Collections.Generic;

namespace ConnectEd.Models
{
    public class PlayerProfile
    {
        public string StudentId { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = "Guest";
        public int TotalXP { get; set; } = 0;
        public int Level { get; set; } = 1;
        public List<Badge> EarnedBadges { get; set; } = new();
    }

    public class Badge
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class MicroModule
    {
        public int ModuleId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int TargetTimeSeconds { get; set; } = 180; // 3 mins default
        public List<ExerciseStep> Steps { get; set; } = new();
    }

    public class ExerciseStep
    {
        public int StepId { get; set; }
        public string ScenarioInstruction { get; set; } = string.Empty;
        public string ExpectedCommand { get; set; } = string.Empty;
        public string ErrorPromptOnFailure { get; set; } = string.Empty;
        public string VisualHint { get; set; } = string.Empty;
    }
}