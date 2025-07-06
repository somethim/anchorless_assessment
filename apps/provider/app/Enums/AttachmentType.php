<?php

namespace App\Enums;

enum AttachmentType: string
{
    case Identification = 'identification';
    case Visa = 'visa';
    case Other = 'other';

    /** @returns array<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function getOrderClause(): string
    {
        $cases = [];
        foreach (self::cases() as $index => $case) {
            $cases[] = "WHEN type = '$case->value' THEN " . ($index + 1);
        }

        return 'CASE ' . implode(' ', $cases) . ' ELSE ' . (count(self::cases()) + 1) . ' END';
    }
}
