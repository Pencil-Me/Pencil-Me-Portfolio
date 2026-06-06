<?php

declare(strict_types=1);

/**
 * Kanonische Domain-Konstanten — synchron zu portfolio-domain.json halten.
 */
final class PortfolioDomain
{
    public const PROJECT_TYPES = ['CUST', 'PRIV', 'FEST'];

    public const TECH_STACK_TYPES = [
        'FEDEV',
        'BEDEV',
        'FEFRAME',
        'BEFRAME',
        'FEBT',
        'DEVOPS',
        'DB',
        'CMS',
        'TEST',
        'PROJECTTOOL',
        'MISC',
        'DESIGN',
        'LANG',
    ];

    public const LOAD_STATUSES = ['PENDING', 'LOADING', 'COMPLETED', 'ERROR'];
}
