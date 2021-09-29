using Newtonsoft.Json;

namespace SB.Common.Types
{
    public record SbVector2
    {
        [JsonConstructor]
        public SbVector2(double x, double y)
        {
            X = x;
            Y = y;
        }

        public double X { get; init; }
        public double Y { get; init; }

        public SbVector2 Add(SbVector2 vector)
        {
            return new SbVector2(X + vector.X, Y + vector.Y);
        }

        public SbVector2 Subtract(SbVector2 vector)
        {
            return new SbVector2(X - vector.X, Y - vector.Y);
        }

        public SbVector2 Multiply(double factor)
        {
            return new SbVector2(X * factor, Y * factor);
        }
    }
}